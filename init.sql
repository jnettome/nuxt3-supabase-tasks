--
-- For use with:
-- https://github.com/supabase/supabase/tree/master/examples/todo-list/sveltejs-todo-list or
-- https://github.com/supabase/examples-archive/tree/main/supabase-js-v1/todo-list
--

create table boards (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text check (char_length(name) > 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table boards enable row level security;

create table board_columns (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  board_id bigint references boards(id) on delete cascade not null,
  name text check (char_length(name) > 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table board_columns enable row level security;

create table todos (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  task text check (char_length(task) > 3),
  body text,
  board_id bigint references boards(id) on delete cascade not null,
  board_column_id bigint references board_columns(id) on delete cascade not null,
  position integer not null default 0,
  is_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table todos enable row level security;

create table tags (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text check (char_length(name) > 1),
  color text check (char_length(color) < 15),
  board_id bigint references boards(id) on delete cascade not null,
  lower_tag text GENERATED ALWAYS AS (lower(name)) STORED,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table tags enable row level security;

create table taggings (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  todo_id bigint references todos(id) on delete cascade not null,
  tag_id bigint references tags(id) on delete cascade not null,
  board_id bigint references boards(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table taggings enable row level security;


create policy "Individuals can create todos." on todos for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own todos. " on todos for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own todos." on todos for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own todos." on todos for
    delete using (auth.uid() = user_id);

create policy "Individuals can create boards." on boards for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own boards. " on boards for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own boards." on boards for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own boards." on boards for
    delete using (auth.uid() = user_id);

create policy "Individuals can create board_columns." on board_columns for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own board_columns. " on board_columns for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own board_columns." on board_columns for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own board_columns." on board_columns for
    delete using (auth.uid() = user_id);

create policy "Individuals can create tags." on tags for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own tags. " on tags for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own tags." on tags for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own tags." on tags for
    delete using (auth.uid() = user_id);

create policy "Individuals can create taggings." on taggings for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own taggings. " on taggings for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own taggings." on taggings for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own taggings." on taggings for
    delete using (auth.uid() = user_id);








-- /* funcao massa pra atualizar varios position */
-- https://github.com/supabase/postgrest-js/issues/174
-- await supabase.rpc('update_todos_order', {payload: [{ "id": 11, "position": 1 }, { "id": 1, "position": 2 }]}));
create or replace function update_todos_order(payload json) returns setof todos as $$
  update todos as todos set position = x.position
  from (
    select id, position from json_populate_recordset(null::todos, payload)
  ) as x
  where todos.id = x.id
  returning todos.*;
$$ language sql;


-- /* funcao massa pra atualizar varios taggings */
-- await supabase.rpc('update_todos_taggings', {payload: [{ "id": 11, "position": 1 }, { "id": 1, "position": 2 }]}));
create or replace function update_todos_taggings(payload json) returns setof taggings as $$
  insert into taggings (user_id, todo_id, tag_id, board_id) 
        select user_id, todo_id, tag_id, board_id from json_populate_recordset(null::taggings, payload)
    on conflict do nothing
    returning taggings.*;
$$ language sql;

-- remove min length checks
-- SELECT constraint_name FROM information_schema.check_constraints WHERE constraint_name ILIKE '%check%';
ALTER TABLE board_columns DROP CONSTRAINT board_columns_name_check;
ALTER TABLE boards DROP CONSTRAINT boards_name_check;
ALTER TABLE tags DROP CONSTRAINT tags_name_check;
ALTER TABLE todos DROP CONSTRAINT todos_task_check;